import { useState } from "react";
import Pagination from "./Pagination";
import Avatar from "../../components/Avatar";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";

const Comments = ({ topic }) => {
  const [comment, setComment] = useState();
  const { user } = useAuthContext();
  const { updateDocument, response } = useFirestore("projects");

  const DEFAULT_COMMENT = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    content: "",
    id: "",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = {
      ...DEFAULT_COMMENT,
      content: comment,
      id: Math.random(),
    };
    console.log(topic.comments);
    await updateDocument(topic.id, {
      comments: [...topic.comments, newComment],
    });

    if (!response.error) {
      setComment("");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(2);
  const indexLastPost = currentPage * postsPerPage;
  const indexFirstPost = indexLastPost - postsPerPage;
  const currentComments = topic.comments.slice(indexFirstPost, indexLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-white w-80 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h4 className="text-2xl font-bold mb-4">Comments:</h4>
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={topic.comments.length}
          paginate={paginate}
        />
        {currentComments.map((comment) => (
          <div key={comment.id} className="flex flex-row items-center mb-2">
            <Avatar src={comment.photoURL} className="mr-2" />
            <p>{comment.displayName}</p>
          </div>
        ))}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="font-bold">Add new comment:</span>
            <textarea
              placeholder="here"
              required
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="block w-full border-gray-400 border rounded py-2 px-3 mt-1"
            ></textarea>
          </label>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Comments;
