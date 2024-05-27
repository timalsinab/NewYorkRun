using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System;

namespace CoffeeRunApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly ILogger<UploadController> _logger;
        private readonly string[] _permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        public UploadController(ILogger<UploadController> logger)
        {
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            _logger.LogInformation("Upload endpoint hit");

            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("No file uploaded or file is empty");
                return BadRequest("No file uploaded");
            }

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext) || !_permittedExtensions.Contains(ext))
            {
                _logger.LogWarning("File type not permitted: {FileName}", file.FileName);
                return BadRequest("File type not permitted");
            }

            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

            if (!Directory.Exists(uploads))
            {
                _logger.LogInformation("Creating uploads directory");
                Directory.CreateDirectory(uploads);
            }

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var newFileName = $"{timestamp}_{file.FileName}";
            var filePath = Path.Combine(uploads, newFileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    _logger.LogInformation("Saving file to: {FilePath}", filePath);
                    await file.CopyToAsync(stream);
                }

                _logger.LogInformation("File uploaded successfully: {FileName}", newFileName);
                return Ok(new { message = "File uploaded successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpGet("winner")]
        public IActionResult GetWinner()
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            _logger.LogInformation("Checking uploads directory: {Uploads}", uploads);

            if (!Directory.Exists(uploads))
            {
                _logger.LogWarning("Uploads directory not found");
                return NotFound("No uploads found");
            }

            var files = Directory.GetFiles(uploads)
                .Where(file => 
                {
                    var fileName = Path.GetFileName(file);
                    var timestamp = fileName.Split('_').First();
                    _logger.LogInformation("Processing file: {File}, extracted timestamp: {Timestamp}", fileName, timestamp);
                    if (DateTime.TryParseExact(timestamp, "yyyyMMddHHmmss", null, System.Globalization.DateTimeStyles.None, out var fileDate))
                    {
                        var hoursDifference = (DateTime.UtcNow - fileDate).TotalHours;
                        _logger.LogInformation("File date: {FileDate}, Hours difference: {HoursDifference}", fileDate, hoursDifference);
                        return hoursDifference <= 24;
                    }
                    _logger.LogWarning("Failed to parse timestamp for file: {File}", fileName);
                    return false;
                })
                .ToArray();

            if (files.Length == 0)
            {
                _logger.LogWarning("No files found within the last 24 hours");
                return NotFound("No files found in the last 24 hours");
            }

            var random = new Random();
            var winnerFile = files[random.Next(files.Length)];
            var fileName = Path.GetFileName(winnerFile);

            _logger.LogInformation("Winner selected: {WinnerFile}", winnerFile);

            return Ok(new { winner = new { fileName } });
        }
    }
}
