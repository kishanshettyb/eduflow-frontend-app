'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';

import { roleSchema } from './schema/roleSchema';

import { useCreateRole } from '@/services/mutation/role';

const formSchema = roleSchema;

type CreateRoleFormProps = {
  onClose: () => void;
};

export const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ onClose }) => {
  const createRoleMutation = useCreateRole();

  const { schoolId } = useSchoolContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: '',
      title: ''
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const role = {
      schoolId: schoolId,
      roleName: values.roleName,
      title: values.title
    };
    createRoleMutation.mutate(role, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Role Name<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Role Name"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
};
