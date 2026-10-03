const API_BASE_URL = "http://127.0.0.1:8000";

export async function askFarmAI(
  question,
  farmData = null
) {
  const trimmedQuestion = question?.trim();

  if (!trimmedQuestion) {
    throw new Error("Please enter a question.");
  }

  console.log(
    "[AgriPower AI] Sending question:",
    trimmedQuestion
  );

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/farm-ai`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          context: farmData,
        }),
      }
    );

    console.log(
      "[AgriPower AI] Backend status:",
      response.status
    );

    const responseText =
      await response.text();

    console.log(
      "[AgriPower AI] Raw response:",
      responseText
    );

    if (!response.ok) {
      let errorMessage =
        "AI service request failed.";

      try {
        const errorData =
          JSON.parse(responseText);

        errorMessage =
          errorData?.detail ||
          errorData?.message ||
          errorMessage;
      } catch {
        if (responseText) {
          errorMessage = responseText;
        }
      }

      throw new Error(errorMessage);
    }

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        "The AI service returned invalid JSON."
      );
    }

    if (
      !result ||
      typeof result.answer !== "string" ||
      !result.answer.trim()
    ) {
      throw new Error(
        "The AI service returned no answer."
      );
    }

    return {
      answer: result.answer.trim(),
      context: result.context || null,
    };
  } catch (error) {
    console.error(
      "[AgriPower AI] Request failed:",
      error
    );

    if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      throw new Error(
        "Could not reach the AgriPower AI backend at http://127.0.0.1:8000. Make sure FastAPI is running."
      );
    }

    throw error;
  }
}