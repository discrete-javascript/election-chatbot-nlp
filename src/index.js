import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { CSVLoader } from "langchain/document_loaders/fs/csv";

// Initialize the LLM to use to answer the question.
const model = new ChatOpenAI({temperature: 0.9,
    openAIApiKey: "YOUR_API_KEY"});
const loader = new CSVLoader("src/data/cbe_mp_consituency_result_2019.csv");

const CSVdocs = await loader.load();

// Create a vector store from the documents.
const vectorStore = await HNSWLib.fromDocuments(CSVdocs, new OpenAIEmbeddings({openAIApiKey: "YOUR_API_KEY"}));

// Initialize a retriever wrapper around the vector store
const vectorStoreRetriever = vectorStore.asRetriever();

// Create a system & human prompt for the chat model
const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;
const messages = [
  SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
  HumanMessagePromptTemplate.fromTemplate("{question}"),
];
const prompt = ChatPromptTemplate.fromMessages(messages);

const chain = RunnableSequence.from([
  {
    context: vectorStoreRetriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const answer = await chain.invoke(
  "What Party name RADHAKRISHNAN, C.P. this candidate is?"
);

console.log({ answer });

/*
{
  answer: 'The party name of candidate RADHAKRISHNAN, C.P. is BJP.'
}
*/