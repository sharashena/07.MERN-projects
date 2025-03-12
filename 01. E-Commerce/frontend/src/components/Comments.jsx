import Comment from "./Comment";

// react
import { memo, useState, useEffect } from "react";

// react router
import { useParams } from "react-router";

// react icons
import Rating from "./Rating";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  createCommentThunk,
  getCommentsThunk,
  updateCommentThunk,
  deleteCommentThunk,
} from "../redux/features/comments/commentsThunk";
import {
  hideAlert,
  errorAlert,
} from "../redux/features/comments/commentsSlice";

const Comments = () => {
  const { comments, alert, loadingComment } = useSelector(
    state => state.comments
  );
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [isModal, setIsModal] = useState(false);

  const { id } = useParams();

  const handleEditComment = id => {
    const editObj = comments?.result?.find(comment => comment.id === id);
    const editId = editObj.id;
    setComment(editObj.comment);
    setRating(editObj.rating);
    setEditId(editId);
    setIsEdit(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = {};

    if (!comment) {
      errors.message = "comment is required";
    }

    if (rating < 0.5) {
      errors.message = "rating must be between 0.5 to 5";
    } else if (rating > 5) {
      errors.message = "rating must be between 0.5 to 5";
    }

    if (Object.keys(errors).length > 0) {
      dispatch(errorAlert(errors.message));

      const timeout = setTimeout(() => {
        dispatch(hideAlert());
      }, 3000);
      return () => clearTimeout(timeout);
    }

    if (isEdit) {
      const result = await dispatch(
        updateCommentThunk({ id: editId, params: { comment, rating } })
      );

      if (updateCommentThunk.fulfilled.match(result)) {
        setComment("");
        setRating(0);
        setEditId(null);
        setIsEdit(false);
      }
    } else {
      const result = await dispatch(
        createCommentThunk({ params: { product: id, comment, rating } })
      );

      if (createCommentThunk.fulfilled.match(result)) {
        setComment("");
        setRating(0);
      }
    }

    const timeout = setTimeout(() => {
      dispatch(hideAlert());
    }, 3000);
    return () => clearTimeout(timeout);
  };

  const handleDeleteComment = async id => {
    const result = await dispatch(deleteCommentThunk(id));

    if (deleteCommentThunk.fulfilled.match(result)) {
      setIsModal(false);
      setComment("");
      setRating(0);
      setEditId(null);
      setIsEdit(false);
    }

    const timeout = setTimeout(() => {
      dispatch(hideAlert());
    }, 3000);
    return () => clearTimeout(timeout);
  };

  const handleOpenModal = () => {
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  useEffect(() => {
    dispatch(getCommentsThunk());
  }, [dispatch]);

  return (
    <div className="comments-container">
      <form onSubmit={handleSubmit}>
        <h3 className={`comment-alert alert-${alert.type}`}>
          {alert.show && alert.msg}
        </h3>
        <Rating rating={rating} setRating={setRating} />
        <h3>comments:</h3>
        <textarea
          className="comment-input"
          placeholder="describe product with few words..."
          disabled={loadingComment}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button
          className="btn btn-block single-product-btn"
          disabled={loadingComment}
        >
          {loadingComment ? (
            <div className="spinner" />
          ) : isEdit ? (
            "edit comment"
          ) : (
            "add comment"
          )}
        </button>
      </form>

      {comments?.numOfComments < 1 && (
        <h3 className="no-comment-msg">product has no comment yet</h3>
      )}

      {comments?.numOfComments > 0 &&
        comments?.result?.map((comm, index) => {
          return (
            <Comment
              key={index}
              {...comm}
              isModal={isModal}
              handleEditComment={handleEditComment}
              handleCloseModal={handleCloseModal}
              handleDeleteComment={handleDeleteComment}
              handleOpenModal={handleOpenModal}
            />
          );
        })}
    </div>
  );
};

export default memo(Comments);
