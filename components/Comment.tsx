// CommentCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type CommentCardProps = {
  comment: string;
  rating: number;
  product_id: number;
  date: Date;
  username: string;
};

export function CommentCard({ username, comment, rating, date }: CommentCardProps) {
  console.log('Rendering CommentCard')

  return (
    <Card style={{ maxWidth: "60vw" }} className="mt-4 max-h-full overflow-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Opinie</CardTitle>
      </CardHeader>
      <CardContent>
          <p>{comment}</p>
          <p>{'⭐'.repeat(rating)}</p>
          <p>{username}</p>
          <p>
            {new Date(date).toLocaleDateString()},
            {new Date(date).toLocaleTimeString().slice(0, 5)}
          </p>
      </CardContent>
      <CardFooter>
        <h2 className="text-xl font-bold">Średnia ocena</h2>
        <p>{'⭐'.repeat(Math.round(rating))}</p>
      </CardFooter>
    </Card>
  );
}