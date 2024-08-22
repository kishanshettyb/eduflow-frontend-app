import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { ViewImage } from '@/components/viewfiles/viewImage';
import { Announcement } from '@/types/admin/announcementTypes';
import { getAllStaffAnnouncements } from '@/services/api/announcement/announcementApi';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

const AnnouncementCarouselCard: React.FC = () => {
  const { schoolId, academicYearId, staffId } = useSchoolContext();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [, setIsLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const plugin = React.useRef(Autoplay({ delay: 3000, duration: 5000, stopOnInteraction: true }));
  const defaultImageUrl = '/other/slider/slide-1.jpeg';

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getAllStaffAnnouncements(schoolId, academicYearId, staffId);
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Failed to fetch announcements', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, [schoolId, academicYearId, staffId]);

  const handleCloseModal = () => {
    setSelectedAnnouncement(null);
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <>
      <div className="p-4 mt-5 grid grid-cols-1 gap-4">
        <h2 className="mb-4 text-xl font-semibold">Announcements</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true
          }}
          plugins={[plugin.current]}
        >
          <CarouselContent>
            {announcements.map((announcement, index) => (
              <CarouselItem key={index} className="basis-full md:basis-1/3 mb-5">
                <Card
                  className="w-full rounded-2xl"
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <div className="relative">
                    {announcement.attachment?.contentType?.includes('image') ? (
                      <ViewImage
                        schoolId={schoolId}
                        attachmentId={announcement.attachment.attachmentId}
                        width="650"
                        height="200"
                        alt={announcement.announcementTitle}
                        priority
                        styles="w-full h-[200px] object-cover rounded-t-2xl"
                      />
                    ) : (
                      <div className="relative">
                        <Image
                          src="/slider/slide-2.jpeg"
                          alt="file"
                          width="650"
                          height="200"
                          className="relative w-full h-[200px] object-cover rounded-t-2xl"
                        />
                        <div className="absolute top-[30%] left-[45%] ">
                          <div className="flex flex-col justify-center items-center">
                            <div className="flex justify-center items-center w-[50px] h-[50px] rounded-full bg-slate-500 opacity-30">
                              <ImageOff className="text-white w-6 h-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute border top-5 right-5 bg-white dark:bg-slate-900 lowercase flex justify-center items-center rounded-2xl py-2 px-3">
                      <p className="text-[10px] capitalize">{announcement.targetType}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div>
                      <div className="border w-[120px] items-center flex justify-center rounded py-1">
                        <p className="text-xs dark:text-slate-200">
                          {moment(announcement.modifiedTime).format('DD-MMMM-YYYY')}
                        </p>
                      </div>
                      <h2 className="text-lg mt-1 font-semibold text-gray-800 dark:text-slate-200 truncate mb-2">
                        {announcement.announcementTitle}
                      </h2>
                    </div>
                    <p className="text-gray-600 h-14 dark:text-slate-500 line-clamp-2 mb-2">
                      {announcement.description}
                    </p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Modal for Announcement Details */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-1/2 p-6 bg-white rounded-lg shadow-lg">
              <button
                onClick={handleCloseModal}
                className="absolute text-2xl text-gray-600 top-2 right-2 hover:text-gray-800"
              >
                &times;
              </button>
              <h2 className="mb-4 text-xl font-bold">{selectedAnnouncement.announcementTitle}</h2>
              <p>{selectedAnnouncement.description}</p>
              {selectedAnnouncement.attachment ? (
                <img
                  src={`/path/to/attachments/${selectedAnnouncement.attachment.attachmentName}`}
                  alt={selectedAnnouncement.announcementTitle}
                  className="mt-4 rounded"
                />
              ) : (
                <img src={defaultImageUrl} alt="Default" className="mt-4 rounded" />
              )}
              <p className="mt-4 text-sm text-gray-400">
                Created on: {new Date(selectedAnnouncement.createdTime).toLocaleDatextring()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnnouncementCarouselCard;
