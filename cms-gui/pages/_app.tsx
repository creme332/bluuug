import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import Header from "../components/HeaderMegaMenu";
import { useEffect, useState } from "react";

interface AppProps {
  Component: () => JSX.Element;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const API_ENDPOINT =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/v1"
      : "https://bluuug.onrender.com/v1";

  useEffect(() => {
    /**
     * Get tags from API
     */
    async function getTags() {
      const tagEndpoint = `${API_ENDPOINT}/posts/tags`;
      try {
        const response = await fetch(tagEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();

        if (response.ok) {
          setTags(json);
          return;
        }

        window.alert(json.error);
      } catch (error) {
        console.log(error);
        window.alert("Unable to fetch tags. Server is down.");
      }
    }

    /**
     * Get categories from API
     */
    async function getCategories() {
      const tagEndpoint = `${API_ENDPOINT}/posts/categories`;

      try {
        const response = await fetch(tagEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();

        if (response.ok) {
          setCategories(json);
          return;
        }

        window.alert(json.error);
      } catch (error) {
        console.log(error);
        window.alert("Unable to fetch categories. Server is down.");
      }
    }

    getCategories();
    getTags();
  }, [API_ENDPOINT]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Head>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💧</text></svg>"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Content management system of bluuug"
        />
        <title>CMS | bluuug</title>
      </Head>
      <Header />
      <Component {...pageProps} allTags={tags} allCategories={categories} />
    </MantineProvider>
  );
}
