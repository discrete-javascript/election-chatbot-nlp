import { CSVLoader } from "langchain/document_loaders/fs/csv";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'YOUR_API_KEY'
});
// import { access } from 'fs/promises';

// const path = './data/your_data.csv';
// console.log(`Current working directory: ${process.cwd()}`);
// try {
//     await access(path);
//     console.log('File found and readable');
// } catch (err) {
//     console.error('Error accessing file:', err);
// }

// Assuming you're using async/await, make sure this code is inside an async function
export async function loadCSVData() {
    const loader = new CSVLoader("src/data/your_data.csv");
    const docs = await loader.load();
    return docs;
}

// async function askOpenAI(question, docs) {
//     // Preparing the context for the chat
//     const messages = docs.map(doc => ({ role: "system", content: doc }));
//     messages.push({ role: "user", content: question });

//     try {
//         const response = await openai.completions.create({
//             model: "gpt-3.5-turbo", // Replace with the chat model you're using
//             messages: messages
//         });

//         return response.data.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('Error in OpenAI chat completion:', error);
//     }
// }

// async function askOpenAI(question, docs) {
//     // Prepare the context for the chat
//     let messages = [];

//     // Assuming each doc is a string, add them as system messages for context
//     for (const doc of docs) {
//         messages.push({ role: "system", content: doc });
//     }

//     // Add the user's question
//     messages.push({ role: "user", content: question });

//     try {
//         const response = await openai.createChatCompletion({
//             model: "gpt-3.5-turbo", // Ensure you are using a chat-compatible model
//             messages: messages
//         });

//         return response.data.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('Error in OpenAI chat completion:', error);
//     }
// }

// async function askOpenAI(question, docs) {
//     const completion = await openai.completions.create({
//         model: "gpt-3.5-turbo",
//         prompt: "This story begins",
//         max_tokens: 30,
//       });
//       console.log(completion.choices[0].text);

//       return completion.choices[0].text;
// }

// async function askOpenAI(question, docs) {
//     // Combine the CSV data into a single string for context
//     const context = docs.join("\n");

//     // Prepare the chat messages
//     let messages = [
//         { role: "system", content: context }, // System message with the context
//         { role: "user", content: question }    // User's question
//     ];

//     try {
//         const response = await openai.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: messages,
//             max_tokens: 30
//         });

//         return response.data.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('Error in OpenAI chat completion:', error);
//     }
// }

async function askOpenAI(question, docs) {
    const context = docs.join("\n");
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: context }, { role: "user", content: question }],
        model: "gpt-3.5-turbo",
        max_tokens: 30
      });
    
      console.log(completion.choices[0]);
        return completion.choices[0].text;
}



async function main() {
    const csvData = await loadCSVData();
    const question = "What is the TC1 max score?";
    const answer = await askOpenAI(question, csvData);
    console.log(answer);
}

main().catch(console.error);
