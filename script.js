$(document).ready(function () {
  $('#getStartedButton').on('click', function () {
    $('#intro').hide();
    $('#formContainer').show();
  });

  $('#nextPersonalInfo').on('click', function () {
    $('#personalInfo').hide();
    $('#educationInfo').show();
  });

  $('#nextEducationInfo').on('click', function () {
    $('#educationInfo').hide();
    $('#prediction').show();
  });

  $('#seeResultButton').on('click', function () {
    const formData = {
      "Education Level": $('input[name="education_level"]:checked').val(),
      "Institution Type": $('input[name="institution_type"]:checked').val(),
      "Gender": $('input[name="gender"]:checked').val(),
      "Age": $('#age').val(),
      "Device": $('input[name="device"]:checked').val(),
      "IT Student": $('input[name="it_student"]:checked').val(),
      "Location": $('input[name="location"]:checked').val(),
      "Financial Condition": $('input[name="financial_condition"]:checked').val(),
      "Internet Type": $('input[name="internet_type"]:checked').val(),
      "Network Type": $('input[name="network_type"]:checked').val()
    };

    if (!validateForm(formData)) {
      alert("Please fill all the required fields.");
      return;
    }

    sendPredictionRequest(formData, function (error, response) {
      if (error) {
        $('#result').html(`<p style="color:red;"><strong>Error:</strong> ${error.message}</p>`);
        $('#prediction').hide();
        $('#resultDisplay').show();
        return;
      }

      const predictionProbabilities = response.prediction[0]; // Object with class labels
      const sorted = Object.entries(predictionProbabilities).sort((a, b) => b[1] - a[1]);
      const topPrediction = sorted[0][0]; // Highest probability class

      let flexibilityLevel = "";
      let message = "";

      switch (topPrediction) {
        case "0":
          flexibilityLevel = "Low";
          message = "You may be struggling to adapt to remote learning. Consider seeking support or improving your digital environment.";
          break;
        case "1":
          flexibilityLevel = "Medium";
          message = "You have moderate adaptability. Focus on consistency and overcoming small challenges.";
          break;
        case "2":
          flexibilityLevel = "High";
          message = "Great job! You show a strong ability to adapt to remote learning environments.";
          break;
        default:
          flexibilityLevel = "Unknown";
          message = "Unable to determine flexibility level.";
      }

      $('#result').html(`
        <p><strong>Predicted Flexibility Level:</strong> ${flexibilityLevel}</p>
        <p><em>${message}</em></p>
      `);

      $('#prediction').hide();
      $('#resultDisplay').show();
    });
  });
});

function validateForm(data) {
  for (let key in data) {
    if (data[key] === undefined || data[key] === "") return false;
  }
  return true;
}
