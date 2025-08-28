
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

const Testimonial = ({ quote, author, role, company, image }: TestimonialProps) => (
  <Card className="border-0 shadow-lg h-full">
    <CardContent className="p-6 h-full flex flex-col">
      <div className="mb-4">
        <svg className="h-8 w-8 text-odoo-primary opacity-50" fill="currentColor" viewBox="0 0 32 32">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>
      <p className="text-odoo-gray mb-6 flex-grow">{quote}</p>
      <div className="flex items-center mt-4">
        <img src={image} alt={author} className="h-12 w-12 rounded-full mr-4" />
        <div>
          <h4 className="font-semibold text-odoo-dark">{author}</h4>
          <p className="text-sm text-odoo-gray">{role}, {company}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Testimonials = () => {
  const testimonials = [
    {
      quote: "BOS transformed how we manage our business. The integrated modules allow us to see the full picture of our operations in one place.",
      author: "Sarah Johnson",
      role: "CEO",
      company: "Innovative Solutions",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      quote: "The voice-guided training made onboarding our team incredibly easy. We were up and running in days, not weeks or months.",
      author: "Michael Chen",
      role: "Operations Director",
      company: "Global Logistics",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      quote: "As a small business owner, I needed an affordable solution that could grow with us. BOS delivers enterprise-level features at a price we can afford.",
      author: "Emma Rodriguez",
      role: "Founder",
      company: "Artisan Creations",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ];

  return (
    <section className="py-16 bg-odoo-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-odoo-dark">What Our Customers Say</h2>
          <p className="mt-4 text-lg text-odoo-gray max-w-3xl mx-auto">
            Thousands of businesses trust BOS to manage their operations and drive growth.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
