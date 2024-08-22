import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <Header />
      <main className="bg-white dark:bg-slate-950 w-100 h-100 ">
        <section className="py-48 w-100 h-100 ">
          <div className="container text-center mx-auto items-center justify-center flex relative">
            <div className="w-100 px-20 ">
              <p className="text-4xl font-semibold mb-4 text-blue-500 ">Welcome to Eduflow</p>
              <h1 className="text-4xl md:text-7xl  leading-[3rem] md:leading-[5rem] mb-5">
                <span className="text-slate-900 font-bold dark:text-slate-300 ">
                  Transforming Education Management with{' '}
                </span>
                <span className="text-blue-600 font-extrabold">Eduflow</span>
              </h1>
              <p className="text-slate-500 w-3/4 m-auto dark:text-slate-400">
                Streamline school management with attendance tracking, grade management,
                parent-teacher communication, and resource allocation. Empower educators and
                administrators for enhanced efficiency and communication.
              </p>
            </div>
            <Image
              src="/other/laptop.svg"
              width="300"
              height="300"
              className="h-44 absolute -bottom-32 -right-10"
              alt="Eduflow Laptop"
            />
            <Image
              src="/other/shape-donut.svg"
              width="400"
              height="400"
              className="h-28 absolute -top-20 left-5"
              alt="Eduflow Donut"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
