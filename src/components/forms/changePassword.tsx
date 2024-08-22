import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useChangePassword } from '@/services/mutation/auth/auth';
import { Eye, EyeOff } from 'lucide-react'; // Assuming you have these icons available
import { useSchoolContext } from '@/lib/provider/schoolContext';

const formSchema = z
  .object({
    userName: z.string(),
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters.')
      .max(12, 'New password must not exceed 12 characters.')
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/,
        'Invalid new password. It must have at least one uppercase letter and one special character.'
      ),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters.')
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword']
      });
    }
  });

export default function ChangePassword() {
  const { userName } = useSchoolContext(); // Get userName from schoolContext
  const [showOldPassword, setShowOldPassword] = useState(false); // State for toggling visibility of old password
  const [showNewPassword, setShowNewPassword] = useState(false); // State for toggling visibility of new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling visibility of confirm password
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: userName || '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    if (userName) {
      form.setValue('userName', userName); // Set userName from context
    }
  }, [userName, form]);

  const changePasswordMutation = useChangePassword();

  async function onSubmit(values) {
    try {
      await changePasswordMutation.mutateAsync(values);
      form.reset(); // Reset the form after successful mutation
    } catch (error) {
      console.error('Password change failed:', error);
    }
  }

  return (
    <>
      <div className="mt-5 p-6 border bg-white dark:bg-slate-900 rounded-2xl w-3/5">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-5 grid grid-cols-1 gap-y-4">
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder="Enter Old Password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter New Password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Enter Confirm Password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-end mt-2 space-x-2">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
