import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { addTodo, listTodos } from "../libs/todo";

export default function Home() {
  const [value, setValue] = useState("");
  const { data, mutate } = listTodos();

  if (!data) {
    return <div>Loading todos...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>React w/REST API server template</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Todo List</h1>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const { data: newTodo } = await addTodo({
              content: value,
            });

            mutate([...data, newTodo], false);
            setValue("");
          }}
        >
          <input
            className={styles.input}
            type="text"
            placeholder="Get eggs from the green grocer"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </form>
        {data.length === 0 ? (
          <div>You have no todos. Make some!</div>
        ) : (
          <ul className={styles.ul}>
            {data.map((t, index) => (
              <li key={index}>{t.content}</li>
            ))}
          </ul>
        )}
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/o2bomb/react-rest"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code available on Github
          {/* <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} /> */}
        </a>
      </footer>
    </div>
  );
}
