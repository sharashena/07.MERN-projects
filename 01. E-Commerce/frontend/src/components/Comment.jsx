import moment from "moment";
import avatar from "../assets/avatar.jpg";

// react icons
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

// redux
import { useSelector } from "react-redux";

const Comment = ({
  id,
  comment,
  rating,
  updatedAt,
  handleEditComment,
  handleDeleteComment,
  handleCloseModal,
  handleOpenModal,
  isModal,
  user,
}) => {
  const { loadingComment } = useSelector(state => state.comments);
  const { user: currentUser } = useSelector(state => state.users);

  const currentUserUsername = currentUser?.username;
  const username = user.username;

  return (
    <article className="user-comment-wrapper">
      {currentUserUsername === username && (
        <div className="comment-btn-container">
          <button
            className="comment-btn edit-btn"
            onClick={() => handleEditComment(id)}
          >
            <MdEdit />
          </button>
          <button className="comment-btn delete-btn" onClick={handleOpenModal}>
            <FaTrash />
          </button>
        </div>
      )}

      {isModal && (
        <div className="delete-comment-overlay">
          <article className="delete-comment-modal">
            {loadingComment ? (
              <div className="loading-alert" />
            ) : (
              <>
                <h3>delete comment?</h3>

                <div className="delete-btn-container">
                  <button
                    type="button"
                    className="delete-comment-btn"
                    onClick={() => handleDeleteComment(id)}
                  >
                    delete
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCloseModal}
                  >
                    cancel
                  </button>
                </div>
              </>
            )}
          </article>
        </div>
      )}

      <div className="user-comment-container">
        <header className="user-comment-header">
          <img src={avatar} alt={username} className="user-comment-logo" />
          <div className="user-comment-rating">
            <h5>{username}</h5>

            {Array.from({ length: 5 }).map((_, index) => {
              const fullValue = index + 1;
              const halfValue = index + 0.5;

              return (
                <button type="button" className="rating-btn" key={index}>
                  {rating >= fullValue ? (
                    <FaStar color="gold" />
                  ) : rating >= halfValue ? (
                    <FaStarHalfAlt color="gold" />
                  ) : (
                    <CiStar color="silver" />
                  )}
                </button>
              );
            })}
          </div>
        </header>
        <p className="comment-updated-date">
          {moment(updatedAt).format("llll")}
        </p>
      </div>
      <p className="user-comment-description">{comment}</p>
    </article>
  );
};

export default Comment;
