import type { Book } from "./types";
import dynamic from "next/dynamic";
import Loading from "./loading";

//dynamic cosa de next donde se importo un componente
const IndexClientPage = dynamic(() => import("./client"), {
  ssr: false,
  loading: Loading,
});

export default async function indexPage() {
  const books: Book[] = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        import("./books.json").then((data) => data.library.map((el) => el.book))
      );
    }, 1000);
  });
  const genres: string[] = Array.from(
    new Set(books.map((books) => books.genre))
  );

  return <IndexClientPage books={books} genres={genres} />;
}

// const books: Book[] = await import("./books.json").then((data) =>
// data.library.map((el) => el.book)
// );
