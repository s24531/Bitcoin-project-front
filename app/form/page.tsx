"use client"
import "../../app/globals.css"
import "../../app/animation.css"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link";
import { useState } from "react";


const formSchema = z.object({
    name: z.string(),
    surname: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string().length(6, { message: "Niepoprawny kod pocztowy" }),
    country: z.string(),
    phoneNumber: z.string().length(9, { message: "Niepoprawny numer telefonu" }),
    email: z.string().email({ message: "Niepoprawny adres email" }),
})

export default function DeliveryForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: "",
            address: "",
            city: "",
            postalCode: "",
            country: "",
            phoneNumber: "",
            email: "",
        },
        mode: "onChange",
    })

    const [showDialog, setShowDialog] = useState(false)

    const onSubmit = (data: any) => {
        if (form.formState.isValid) {
            setShowDialog(true);
        }
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-4xl font-bold mb-3">Dane do wysyłki</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full flex flex-col gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Imię</FormLabel>
                            <FormControl>
                                <Input placeholder="Imię" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <FormField control={form.control} name="surname" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Nazwisko</FormLabel>
                            <FormControl>
                                <Input placeholder="Nazwisko" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <FormField control={form.control} name="address" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Adres</FormLabel>
                            <FormControl>
                                <Input placeholder="Adres" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <FormField control={form.control} name="city" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Miasto</FormLabel>
                            <FormControl>
                                <Input placeholder="Miasto" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <FormField control={form.control} name="postalCode" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Kod pocztowy</FormLabel>
                            <FormControl>
                                <Input placeholder="Kod pocztowy" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <FormField control={form.control} name="country" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Państwo</FormLabel>
                            <FormControl>
                                <Input placeholder="Państwo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Numer telefonu</FormLabel>
                            <FormControl>
                                <Input placeholder="Numer telefonu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <FormField control={form.control} name="email" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button disabled={!form.formState.isValid} type="submit">Potwierdź</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Potwierdź</DialogTitle>
                                <DialogDescription>
                                    Czy na pewno chcesz wysłać zamówienie?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Link href="/form/submit">
                                    <Button type="submit">Tak</Button>
                                </Link>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
        </main>
    )
}
