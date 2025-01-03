export async function getBibleVerse() {
  try {
    const response = await fetch(
      "https://beta.ourmanna.com/api/v1/get?format=json&order=random"
    );
    console.log("🚀 ~ getBibleVerse ~ response:", response);
    if (!response.ok) {
      throw new Error("Failed to fetch Bible verse");
    }
    const data = await response.json();

    console.log(data);

    return {
      text: data.verse.details.text,
      reference: data.verse.details.reference,
    };
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    return null;
  }
}
