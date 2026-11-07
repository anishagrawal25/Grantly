import { DocumentType } from '../types';

export const MASTER_DOCUMENTS: DocumentType[] = [
  {
    id: 'aadhaar',
    label: 'Aadhaar Card',
    hint: 'UIDAI card or download from eaadhaar.uidai.gov.in',
  },
  {
    id: 'income-certificate',
    label: 'Income Certificate',
    hint: 'Issued by your local revenue / Tehsil office or e-District portal',
  },
  {
    id: 'caste-certificate',
    label: 'Caste / Category Certificate',
    hint: 'Issued by competent authority (SDM / Tehsildar) for reserved category',
  },
  {
    id: 'marksheet',
    label: 'Previous Exam Marksheet',
    hint: 'Official grade sheet or transcript from your previous academic year',
  },
  {
    id: 'bank-passbook',
    label: 'Bank Account Passbook',
    hint: 'Passbook front page or cancelled cheque showing account number & IFSC',
  },
  {
    id: 'admission-proof',
    label: 'College Admission / Fee Receipt',
    hint: 'Current year fee receipt or college allotment letter',
  },
  {
    id: 'domicile-certificate',
    label: 'Domicile / Residence Certificate',
    hint: 'State residency proof issued by local revenue department',
  },
  {
    id: 'disability-certificate',
    label: 'Disability Certificate / UDID',
    hint: 'Unique Disability ID (UDID) or government hospital medical certificate',
  },
  {
    id: 'passport-photo',
    label: 'Passport Photograph',
    hint: 'Recent color photograph with light background',
  },
  {
    id: 'bonafide-certificate',
    label: 'Bonafide Student Certificate',
    hint: 'Issued on current college/school letterhead signed by the principal',
  },
];
