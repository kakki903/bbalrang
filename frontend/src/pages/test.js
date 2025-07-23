import React, { useEffect, useState } from "react";

export default function TestPage() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ping`)
      .then((res) => res.json())
      .then((data) => setMsg(data.message));
  }, []);

  return <div>서버 응답: {msg}</div>;
}
