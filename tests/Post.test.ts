import { createTestContext } from "./__helpers";

const ctx = createTestContext();

it("ensures that a draft can be created and published", async () => {
  // Create a new draft
  const draftResult = await ctx.client.request(`
        mutation {
            createDraft(title: "First post", body: "First post content") {
                id
                title
                body
                published
            }
        }
    `);

  const persistedData = await ctx.db.post.findMany();

  // Snapshot that draft and expect `published` to be false
  expect(persistedData).toMatchInlineSnapshot(`
Array [
  Object {
    "body": "First post content",
    "id": 1,
    "published": false,
    "title": "First post",
  },
  Object {
    "body": "First post content",
    "id": 2,
    "published": false,
    "title": "First post",
  },
]
`);

  // Publish the previously created draft
  const publishedResult = await ctx.client.request(
    `
        mutation publishDraft($draftId: Int!) {
            publish(draftId: $draftId) {
                id
                title
                body
                published
            }
        }
  `,
    {
      draftId: draftResult.createDraft.id,
    }
  );

  // Snapshot the published draft and expect `published` to be true
  expect(publishedResult).toMatchInlineSnapshot(`
    Object {
    "publish": Object {
        "body": "First post content",
        "id": 1,
        "published": true,
        "title": "First post",
    },
    }
`);
});
