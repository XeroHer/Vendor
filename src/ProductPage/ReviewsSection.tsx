import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL;

type Reply = {
  _id?: string;
  user: string;
  comment: string;
};

type Review = {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  likes?: number;
  dislikes?: number;
  replies?: Reply[];
};

type Props = {
  productId: string;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
};

function Stars({ value }: { value: number }) {
  return (
    <div className="flex text-yellow-500 text-sm">
      {"★".repeat(value)}
      {"☆".repeat(5 - value)}
    </div>
  );
}

export default function ReviewsSection({
  productId,
  reviews,
  setReviews,
}: Props) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<
    Record<string, string>
  >({});

  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  // ======================
  // API HELPER
  // ======================
  const apiCall = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  };

  // ======================
  // SUBMIT REVIEW
  // ======================
  const submitReview = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const data = await apiCall(
        `${API_URL}/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            comment: comment.trim(),
          }),
        }
      );

      setReviews(data.product.reviews || []);
      setComment("");
      setRating(5);
    } catch (err) {
      setError("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LIKE (OPTIMISTIC)
  // ======================
  const handleLike = async (reviewId: string) => {
    setActionLoading(reviewId);

    // Optimistic update
    setReviews((prev) =>
      prev.map((r) =>
        r._id === reviewId
          ? { ...r, likes: (r.likes || 0) + 1 }
          : r
      )
    );

    try {
      const data = await apiCall(
        `${API_URL}/api/products/${productId}/reviews/${reviewId}/like`,
        { method: "POST" }
      );

      setReviews(data.product.reviews || []);
    } catch (err) {
      setError("Failed to like review.");
    } finally {
      setActionLoading(null);
    }
  };

  // ======================
  // DISLIKE (OPTIMISTIC)
  // ======================
  const handleDislike = async (reviewId: string) => {
    setActionLoading(reviewId);

    setReviews((prev) =>
      prev.map((r) =>
        r._id === reviewId
          ? { ...r, dislikes: (r.dislikes || 0) + 1 }
          : r
      )
    );

    try {
      const data = await apiCall(
        `${API_URL}/api/products/${productId}/reviews/${reviewId}/dislike`,
        { method: "POST" }
      );

      setReviews(data.product.reviews || []);
    } catch (err) {
      setError("Failed to dislike review.");
    } finally {
      setActionLoading(null);
    }
  };

  // ======================
  // REPLY
  // ======================
  const submitReply = async (reviewId: string) => {
    const replyText = replyTextMap[reviewId];
    if (!replyText?.trim()) return;

    try {
      setError(null);

      const data = await apiCall(
        `${API_URL}/api/products/${productId}/reviews/${reviewId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comment: replyText.trim(),
          }),
        }
      );

      setReviews(data.product.reviews || []);

      setReplyingTo(null);
      setReplyTextMap((prev) => ({
        ...prev,
        [reviewId]: "",
      }));
    } catch (err) {
      setError("Failed to post reply.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 border-t pt-8">
      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-6">
        Customer Reviews
      </h2>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* REVIEW FORM */}
      <div className="bg-white p-5 rounded-xl shadow border mb-8">
        <p className="font-medium mb-2">Write a review</p>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded w-40 mb-3"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full border rounded-lg p-3 h-24"
        />

        <button
          onClick={submitReview}
          disabled={loading || !comment.trim()}
          className="mt-3 bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Posting..." : "Submit Review"}
        </button>
      </div>

      {/* REVIEWS */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet. Be the first!
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white border rounded-xl p-5 space-y-3"
            >
              <div className="flex justify-between">
                <p className="font-semibold">{r.user}</p>
                <Stars value={r.rating} />
              </div>

              <p className="text-gray-700">{r.comment}</p>

              {/* ACTIONS */}
              <div className="flex gap-5 text-sm">
                <button
                  disabled={actionLoading === r._id}
                  onClick={() => handleLike(r._id)}
                  className="text-green-600 disabled:opacity-50"
                >
                  👍 {r.likes || 0}
                </button>

                <button
                  disabled={actionLoading === r._id}
                  onClick={() => handleDislike(r._id)}
                  className="text-red-500 disabled:opacity-50"
                >
                  👎 {r.dislikes || 0}
                </button>

                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === r._id ? null : r._id
                    )
                  }
                  className="text-blue-600"
                >
                  Reply
                </button>
              </div>

              {/* REPLY BOX */}
              {replyingTo === r._id && (
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-black">
                  <textarea
                    value={replyTextMap[r._id] || ""}
                    onChange={(e) =>
                      setReplyTextMap((prev) => ({
                        ...prev,
                        [r._id]: e.target.value,
                      }))
                    }
                    className="w-full border p-2 rounded text-sm"
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => submitReply(r._id)}
                      disabled={
                        !replyTextMap[r._id]?.trim()
                      }
                      className="bg-black text-white px-3 py-1 text-sm rounded disabled:opacity-50"
                    >
                      Post Reply
                    </button>

                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* REPLIES */}
              {r.replies?.length ? (
                <div className="ml-4 border-l pl-4 space-y-2">
                  {r.replies.map((rep, i) => (
                    <div
                      key={rep._id || `${rep.user}-${i}`}
                      className="bg-gray-50 p-2 rounded text-sm"
                    >
                      <p className="font-semibold">
                        {rep.user}
                      </p>
                      <p className="text-gray-600">
                        {rep.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}