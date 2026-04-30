import React from "react";
import { supabase } from "../lib/supabase";


const NewsletterForm: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || loading) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from("subscribers")
        .insert([{ email }]);

      if (error) {
        console.log(error);
        alert(error.message);
        return;
      }

      setEmail("");
      alert("Subscribed successfully!");
    } catch (err) {
      console.log(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h3 className="font-semibold mb-4 text-white">Stay Updated</h3>

      <p className="text-sm text-gray-300 mb-3">
        Subscribe for latest offers & updates.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-lg overflow-hidden bg-white/10 border border-white/20 backdrop-blur-md">

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 text-base sm:text-sm bg-transparent outline-none text-white placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full sm:w-auto bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>

        </div>
      </form>
    </section>
  );
};

export default NewsletterForm;