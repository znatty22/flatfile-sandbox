import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { body, method } = req;
  switch (method) {
    case "GET":
      res.status(200).json({ result: "GET request" });
      break;
    case "POST":
      const { currentChunkIndex, totalChunks } = req.query;
      console.log(`Chunk: ${currentChunkIndex} Total: ${totalChunks}`);
      res.status(200).json({ message: "Received data", data: body });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
