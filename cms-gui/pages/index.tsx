import { Title, Group, Stack } from "@mantine/core";
import {
  Container,
  Button,
  TextInput,
  MultiSelect,
  Select,
} from "@mantine/core";
import React from "react";
import { useForm } from "@mantine/form";
import TextEditor from "../components/TextEditor";

const content = `
<p>
  That’s a boring paragraph followed by a fenced code block:
</p>
<pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
if (i % 15 == 0)
console.log("FizzBuzz");
else if (i % 3 == 0)
console.log("Fizz");
else if (i % 5 == 0)
console.log("Buzz");
else
console.log(i);
}</code></pre>
<p>
  Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
</p>
`;

interface formInterface {
  allTags: string[];
  allCategories: string[];
}

export default function Form({ allTags, allCategories }: formInterface) {
  const form = useForm({
    initialValues: {
      title: "",
      summary: false,
      category: "",
      tags: [],
      body: content,
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    // },
  });

  function updatePostBody(newBody: string) {
    form.setFieldValue("body", newBody);
  }

  return (
    <Container pb={20}>
      <Title order={1} mb={10}>
        Create post
      </Title>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack gap="lg">
          <TextInput
            withAsterisk
            label="Title"
            placeholder="A beautiful title"
            {...form.getInputProps("title")}
          />
          <TextInput
            withAsterisk
            label="Summary"
            placeholder="A short description of the post"
            {...form.getInputProps("summary")}
          />
          <Group>
            <Select
              required
              style={{ flex: 1 }}
              label="Category"
              placeholder="Pick category"
              data={allCategories}
              {...form.getInputProps("category")}
            />
            <MultiSelect
              style={{ flex: 1 }}
              label="Tags"
              placeholder="Pick tags"
              data={allTags}
              {...form.getInputProps("tags")}
            />
          </Group>
          <TextEditor body={form.values.body} updateContent={updatePostBody} />
          <Group justify="center">
            <Button type="submit" fullWidth>
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
