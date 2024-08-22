import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { School } from 'lucide-react';
import { useGetAllSchools } from '@/services/queries/superadmin/schools';
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
  schoolId: z.string().min(1, {
    message: 'Please select a school.'
  })
});

function GetAdminForm({ onSchoolSelect }) {
  const { data: schoolsData } = useGetAllSchools();
  const searchParams = useSearchParams();
  const schoolIdFromParams = searchParams.get('schoolId') || '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolId: schoolIdFromParams
        ? schoolIdFromParams
        : schoolsData?.data && schoolsData.data.length > 0
          ? schoolsData.data[schoolsData.data.length - 1].schoolId.toString()
          : ''
    }
  });
  useEffect(() => {
    if (schoolsData?.data && !schoolIdFromParams) {
      const latestSchool = schoolsData.data[schoolsData.data.length - 1];
      if (latestSchool) {
        form.setValue('schoolId', latestSchool.schoolId.toString());
        onSchoolSelect(latestSchool.schoolId.toString());
      }
    }
  }, [schoolsData, schoolIdFromParams, form]);

  // const onSubmit = (data) => {
  //   console.log('Form submitted:', data);
  // };

  const handleChange = (selectedSchoolId) => {
    form.setValue('schoolId', selectedSchoolId);
    onSchoolSelect(selectedSchoolId);
  };

  return (
    <Form {...form}>
      <div className="flex justify-start w-100">
        <FormField
          control={form.control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-stat">
                <School className="w-4 h-4 me-2 inline-flex" />
                Select School
              </FormLabel>
              <Select onValueChange={handleChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[400px] text-ellipsis whitespace-nowrap">
                    <SelectValue placeholder="Select a School" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schoolsData?.data.map((item) => (
                    <SelectItem key={item.schoolId} value={item.schoolId.toString()}>
                      {item.schoolName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}

export default GetAdminForm;
