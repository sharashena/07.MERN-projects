import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";

const Rating = ({ rating, setRating }) => {
  const handleChangeRating = value => {
    setRating(value);
  };

  return (
    <div className="rating-container">
      <h3>rating:</h3>
      {Array.from({ length: 5 }).map((_, index) => {
        const fullValue = index + 1;
        const halfValue = index + 0.5;

        return (
          <span key={index} className="star-container">
            <span
              className="star-half"
              onClick={() => handleChangeRating(halfValue)}
            />
            <span
              className="star-full"
              onClick={() => handleChangeRating(fullValue)}
            />

            {rating >= fullValue ? (
              <FaStar color="gold" />
            ) : rating >= halfValue ? (
              <FaStarHalfAlt color="gold" />
            ) : (
              <CiStar color="gray" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
