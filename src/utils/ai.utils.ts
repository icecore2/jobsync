import { JobResponse } from "@/models/job.model";
import {
  ContactInfo,
  Education,
  Resume,
  ResumeSection,
  SectionType,
  WorkExperience,
} from "@/models/profile.model";

export const convertResumeToText = (resume: Resume): Promise<string> => {
  return new Promise((resolve) => {
    const formatContactInfo = (contactInfo?: ContactInfo) => {
      if (!contactInfo) return "";
      return `
       Name: ${contactInfo.firstName} ${contactInfo.lastName}
       Headline: ${contactInfo.headline}
       Email: ${contactInfo.email || "N/A"}
       Phone: ${contactInfo.phone || "N/A"}
       Address: ${contactInfo.address || "N/A"}
       `;
    };

    const formatWorkExperiences = (workExperiences?: WorkExperience[]) => {
      if (!workExperiences || workExperiences.length === 0) return "";
      return workExperiences
        .map(
          (experience) => `
         Company: ${experience.Company.label}
         Job Title: ${experience.jobTitle.label}
         Location: ${experience.location.label}
         Description: ${experience.description}
         `
        )
        .join("\n");
    };
    // Start Date: ${experience.startDate.toLocaleDateString().split("T")[0]}
    // End Date: ${
    //   experience.currentJob
    //     ? "Present"
    //     : experience.endDate.toLocaleDateString().split("T")[0]
    // }

    const formatEducation = (educations?: Education[]) => {
      if (!educations || educations.length === 0) return "";
      return (
        educations
          .map(
            (education) => `
             Institution: ${education.institution}
             Degree: ${education.degree}
             Field of Study: ${education.fieldOfStudy}
             Location: ${education.location}
             Description: ${education.description || "N/A"}
             `
          )
          // Start Date: ${education.startDate.toLocaleDateString().split("T")[0]}
          // End Date: ${
          //   education.endDate
          //     ? education.endDate.toLocaleDateString().split("T")[0]
          //     : "N/A"
          // }
          .join("\n")
      );
    };

    const formatResumeSections = (sections?: ResumeSection[]) => {
      if (!sections || sections.length === 0) return "";
      return sections
        .map((section) => {
          switch (section.sectionType) {
            case SectionType.SUMMARY:
              return `Summary: ${section.summary?.content || "N/A"}`;
            case SectionType.EXPERIENCE:
              return formatWorkExperiences(section.workExperiences);
            case SectionType.EDUCATION:
              return formatEducation(section.educations);
            default:
              return "";
          }
        })
        .join("\n");
    };

    const inputMessage = `
                 
                 Title: ${resume.title}
                 ${formatContactInfo(resume.ContactInfo)}
                 ${formatResumeSections(resume.ResumeSections)}
                 `;
    return resolve(inputMessage);
  });
};

export const convertJobToText = (job: JobResponse): Promise<string> => {
  return new Promise((resolve) => {
    const {
      description,
      JobTitle: { label: jobTitle },
      Company: { label: companyName },
      Location: { label: location },
    } = job;
    // Remove HTML tags from the description
    const plainDescription = description.replace(/<[^>]+>/g, "");

    const jobText = `
       Job Title: ${jobTitle}
       Company: ${companyName}
       Location: ${location}
       Description: ${plainDescription}
     `;

    return resolve(jobText);
  });
};
