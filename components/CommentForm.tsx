import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactStars from 'react-stars';

const formSchema = z.object({
  username: z.string(),
  comment: z.string(),
  rating: z.number(),
});

type CommentFormProps = {
  product_id: number;
};

export function CommentForm({ product_id }: CommentFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      comment: '',
      rating: 0,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    fetch('http://localhost:3001/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        product_id: product_id,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        form.reset();
      });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto p-2">
      <input {...form.register('username')} required placeholder="Nazwa użytkownika" className="mb-2 md:mb-0 md:mr-2 flex-grow p-2 border rounded" />
      <textarea {...form.register('comment')} required placeholder="Komentarz" className="mb-2 md:mb-0 md:mr-2 flex-grow p-2 border rounded" />
      <ReactStars
        count={5}
        value={form.watch('rating')}
        onChange={(newRating: number) => form.setValue('rating', Math.round(newRating))}
        size={24}
      />
      <button type="submit" className="mt-2 md:mt-0 p-2 bg-blue-500 text-white rounded cursor-pointer">Wyślij</button>
    </form>
  );
}