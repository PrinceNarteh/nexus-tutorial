import { extendType, nonNull, objectType, stringArg, intArg } from "nexus";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.int("id");
    t.string("title");
    t.string("body");
    t.boolean("published");
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    // All Post
    t.list.field("posts", {
      type: "Post",
      resolve(_root, _args, { db }) {
        return db.post.findMany({ where: { published: true } });
      },
    });

    // Drafted Post
    t.nonNull.list.field("draft", {
      type: "Post",
      resolve(_root, _args, { db }) {
        return db.post.findMany({ where: { published: false } });
      },
    });

    // Get post by ID
    t.field("getPost", {
      type: "Post",
      args: {
        postId: nonNull(intArg()),
      },
      resolve(_root, { postId }, { db }) {
        return db.post.findUnique({ where: { id: postId } });
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    // create draft post
    t.nonNull.field("createDraft", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_root, args, { db }) {
        const draft = {
          title: args.title,
          body: args.body,
          published: false,
        };

        return db.post.create({ data: draft });
      },
    });

    // Published Post
    t.field("publish", {
      type: "Post",
      args: {
        draftId: nonNull(intArg()),
      },
      resolve(_root, { draftId }, { db }) {
        return db.post.update({
          where: {
            id: draftId,
          },
          data: {
            published: true,
          },
        });
      },
    });
  },
});
