// Improved function to send the prediction request to the Flask API
function sendPredictionRequest(formData, callback) {
    $.ajax({
      url: "http://localhost:8000/api/students_adaptability_prediction",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ inputs: [formData] }),
      timeout: 5000, // 5 seconds timeout
      success: function (response) {
        callback(null, response);
      },
      error: function (xhr, status, error) {
        let message = "Unknown error occurred.";
  
        if (xhr.responseJSON && xhr.responseJSON.error) {
          message = xhr.responseJSON.error;
        } else if (xhr.status === 0) {
          message = "Cannot connect to API server. Make sure it's running.";
        } else if (status === "timeout") {
          message = "The request timed out. Please try again.";
        }
  
        callback({ status, message }, null);
      }
    });
  }
  