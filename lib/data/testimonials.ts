export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  avatarAlt?: string;
};

/**
 * Homepage testimonials — used when WordPress parse returns none.
 * Keep in sync with the review cards on xoomplus.co.uk.
 */
export const testimonials: Testimonial[] = [
  {
    id: "hashaam-khalid",
    quote:
      "Got great copywriting services and social media services. Great content writers, also social media team too. Wrote some of the best content ever written. Great sense of humor, charming and handsome staff. Especially content writer.",
    name: "Hashaam Khalid",
    role: "Outstanding Content Team",
    company: "",
    avatar:
      "https://concisemedico.co.uk/wp-content/uploads/2024/09/user.png",
    avatarAlt: "Hashaam Khalid",
  },
  {
    id: "muhammad-tayyab",
    quote:
      "I had a great experience working with Xoomplus! The team is super professional and really knows their stuff when it comes to web development. They built custom solutions for me quickly without compromising on quality. Definitely recommend them if you're looking for top-notch web development.",
    name: "Muhammad Tayyab",
    role: "Top-Notch Web Development",
    company: "",
    avatar:
      "https://concisemedico.co.uk/wp-content/uploads/2024/09/user.png",
    avatarAlt: "Muhammad Tayyab",
  },
  {
    id: "jawad-rehman",
    quote:
      "Great experience working with XoomPlus. The team is responsive, supportive, and delivers on time. Really happy with the results",
    name: "Jawad Rehman",
    role: "Great Experience",
    company: "",
    avatar:
      "https://concisemedico.co.uk/wp-content/uploads/2024/09/user.png",
    avatarAlt: "Jawad Rehman",
  },
  {
    id: "salma-nawaz",
    quote:
      "This full stack digital marketing agency delivered outstanding results across SEO, PPC, content marketing, and social media. Their data driven approach, clear communication, and integrated strategy helped boost our online visibility, search rankings, and lead generation. Highly recommend for businesses seeking a reliable marketing solution!",
    name: "Salma Nawaz",
    role: "Outstanding Results",
    company: "",
    avatar:
      "https://concisemedico.co.uk/wp-content/uploads/2024/09/user.png",
    avatarAlt: "Salma Nawaz",
  },
  {
    id: "ayesha-khan",
    quote:
      "I recently joined Xoom Plus as a Content Writer Intern, and my experience so far has been excellent. The company offers flexible working hours, which helps maintain a healthy work-life balance. The work environment is very positive, and the staff is cooperative, supportive, and welcoming.",
    name: "Ayesha Khan",
    role: "Great Workplace",
    company: "",
    avatar:
      "https://concisemedico.co.uk/wp-content/uploads/2024/09/user.png",
    avatarAlt: "Ayesha Khan",
  },
];

export const testimonialsSectionCopy = {
  eyebrow: "testimonials",
  title: "Discover how XoomPlus drives real growth for businesses like yours",
  body: "",
} as const;
