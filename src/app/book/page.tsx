import type { Metadata } from "next";
import { Suspense } from "react";
import BookForm from "./book-form";

export const metadata: Metadata = {
  title: "Request an Appointment",
  description: "Request an appointment with Tripple S Wellness Spa in Gaborone.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return <Suspense fallback={<main className="bookPage"><div className="formWrap"><div className="formCard">Opening appointment request…</div></div></main>}><BookForm /></Suspense>;
}