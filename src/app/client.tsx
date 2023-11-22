'use client';
import React from 'react';
import type { Book } from './types';

export default function IndexClientPage({
  books,
  genres
}: {
  books: Book[];
  genres: Book['genre'][];
}) {
  const [genre, setGenre] = React.useState<string>('');
  const [readList, setReadList] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState('0');
  const fieldReadList = books.filter((el) => readList.includes(el.ISBN));
  const matches = React.useMemo(
    () => (genre ? books.filter((el) => el.genre == genre) : books),
    [genre, books]
  );
  const [booksList, setBooksList] = React.useState<Book[]>(matches);

  function getReadList() {
    setReadList(
      JSON.parse(localStorage.getItem('readList') ?? '[]') as Book['ISBN'][]
    );
  }
  React.useEffect(() => {
    getReadList();
  }, []);

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      getReadList();
      console.log('en esta ventana es donde se esta escuchando LOL');
    });
    window.removeEventListener('storage', getReadList);
  }
  const handleClick = (el: string) => {
    const updatedBooks = readList.includes(el)
      ? readList.filter((readBook) => readBook != el)
      : [...readList, el];
    setReadList(updatedBooks);
    localStorage.setItem('readList', JSON.stringify(updatedBooks));
    console.log(books);
  };
  const handleChangeMinPages = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(e.target.value);
    const booksRange = books.filter(
      (el) => el.pages <= parseInt(e.target.value, 10)
    );
    setBooksList(booksRange);
  };

  return (
    <article className="grid grid-cols-[1fr,200px] gap-12">
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 ">
        {booksList.map((el) => {
          return (
            <div key={el.ISBN} className="cursor-pointer ">
              <img
                className="w-48 aspect-[16/25]"
                src={el.cover}
                alt={el.title}
                onClick={() => handleClick(el.ISBN)}
              />
              <h3 className="mb-4">
                {readList.includes(el.ISBN) && '⭐'}
                {el.title}
              </h3>
            </div>
          );
        })}
      </ul>
      <article className="flex flex-col items-center">
        <nav className="flex flex-col items-center justify-center">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="h-7 px-2 rounded-lg cursor-pointer mb-4"
          >
            <option value="">All</option>

            {genres.map((el, index) => {
              return (
                <option key={index} value={el}>
                  {el}
                </option>
              );
            })}
          </select>
          <div className="flex justify-center items-center gap-2 mb-6 ">
            <label htmlFor="range">Pages</label>
            <input
              type="range"
              id="range"
              min="0"
              max="1201"
              onChange={handleChangeMinPages}
              value={filters}
            />
            <span>{filters}</span>
          </div>
        </nav>
        <div className="h-[600px] w-40 overflow-y-auto">
          <h3 className="my-6 text-xl">Readlist</h3>
          {fieldReadList.map((el) => {
            return (
              <div key={el.ISBN} className="cursor-pointer">
                <img
                  className="w-24 aspect-[16/25]"
                  src={el.cover}
                  alt={el.title}
                  onClick={() => handleClick(el.ISBN)}
                />
                <p className="mb-4 w-24">{el.title}</p>
              </div>
            );
          })}
        </div>
      </article>
    </article>
  );
}
