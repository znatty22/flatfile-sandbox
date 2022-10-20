import type { NextPage } from "next";
import { Flatfile } from "@flatfile/sdk";

const employeesEmbedId = "11aa7745-9661-4f7d-a04a-c9b8baa15b94";
const manifestEmbedId = "5b090352-0167-4a82-bab3-77572deee8de";
const embedId = manifestEmbedId;

async function submitData(event: any) {
  event.preventDefault();
  console.log("Importing data...");

  await Flatfile.requestDataFromUser({
    embedId,
    user: { id: 1, name: "Natasha Singh", email: "natasha@d3b.center" },
    org: { id: 2, name: "CHOP" },
    chunkSize: 1,
    onData: async (chunk, next) => {
      if (chunk.records.length) {
        console.log("Submitting data to backend!");
        const params = {
          currentChunkIndex: String(chunk.currentChunkIndex),
          totalChunks: String(chunk.totalChunks),
          isLastChunk: String(
            chunk.currentChunkIndex === chunk.totalChunks - 1
          ),
        };
        console.log(
          `Chunk: ${chunk.currentChunkIndex} Total: ${chunk.totalChunks}`
        );
        await fetch("/api/data?" + new URLSearchParams(params), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: chunk.records.map((record) => record.data),
          }),
        });
      }

      next();
    },
    onComplete() {
      console.log("Complete import");
    },
    onError(error) {
      console.log("Error occurred in the import");
    },
  });
}

const Home: NextPage = () => {
  return (
    <div className="bg-slate-400 flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-3xl font-bold text-white">Flatfile Demo</h1>
        <div className="flex items-center gap-x-2">
          <button
            className="rounded-xl bg-pink-400 text-white px-6 py-3 m-8 hover:bg-pink-500"
            onClick={submitData}
          >
            Import Data
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
