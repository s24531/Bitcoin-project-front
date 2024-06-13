"use client"
import "../../globals.css";
import "../../animation.css"

import { useEffect, useState } from "react";
import { Details } from "@/components/Details";
import { CommentCard } from "@/components/Comment";
import { CommentForm } from "@/components/CommentForm";

type DetailsProps = {
    id: number;
    name: string;
    image: string;
    detailed_description: string;
    price: number;
    stock: number;
}

type Comment = {
    comment: string;
    rating: number;
    product_id: number;
    date: Date;
    username: string;
}

export default function Page({ params }: { params: any }) {
    const id = params.id;

    const [detailsData, setDetails] = useState<DetailsProps[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/api/planes/product/details/${id}`)
                .then(response => response.json())
                .then(data => {
                    setDetails([data]);
                });
        }
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:3001/api/comments/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setComments(data);
                const averageRating = data.reduce((total: number, comment: { rating: number; }) => total + comment.rating, 0) / data.length;
                setRating(averageRating);
            });
    }, [id]);

    return (
        <>
            <div style={{ minHeight: "85vh" }} className="flex items-center justify-center overflow-hidden">
                {detailsData.map((details: DetailsProps) => (
                    <div key={details.id}>
                        <Details {...details} />
                    </div>
                ))}
            </div>
            <div>
                <CommentForm product_id={id} />
            </div>
            <div>
                {comments.map((comment: Comment) => (
                    <div key={comment.product_id}>
                        <CommentCard {...comment} />
                    </div>
                ))}
            </div>
        </>
    )
}