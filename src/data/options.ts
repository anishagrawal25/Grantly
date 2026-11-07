import { Category, Course, Gender, IncomeBracket, Level } from '../types';

export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const CATEGORY_OPTIONS: { value: Category; label: string; desc: string }[] = [
  { value: 'General', label: 'General / Open', desc: 'Unreserved academic category' },
  { value: 'OBC', label: 'OBC', desc: 'Other Backward Classes (Non-Creamy / Creamy)' },
  { value: 'SC', label: 'SC', desc: 'Scheduled Castes' },
  { value: 'ST', label: 'ST', desc: 'Scheduled Tribes' },
  { value: 'EWS', label: 'EWS', desc: 'Economically Weaker Section (General category)' },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Other', label: 'Other / Non-binary' },
];

export const COURSE_OPTIONS: { value: Course; label: string }[] = [
  { value: 'Engineering', label: 'Engineering / Tech' },
  { value: 'Medical', label: 'Medicine & Healthcare' },
  { value: 'Arts & Science', label: 'Arts & Science' },
  { value: 'Commerce', label: 'Commerce & Finance' },
  { value: 'Law', label: 'Law & Judiciary' },
  { value: 'Management', label: 'Management / MBA' },
  { value: 'Other', label: 'Other Discipline' },
];

export const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: 'School', label: 'Class 9–12 / School' },
  { value: 'Diploma', label: 'Polytechnic / Diploma' },
  { value: 'Undergraduate', label: 'Undergraduate (Degree)' },
  { value: 'Postgraduate', label: 'Postgraduate (Master/PhD)' },
];

export const INCOME_OPTIONS: {
  value: IncomeBracket;
  label: string;
  helper: string;
}[] = [
  {
    value: 'under-2.5L',
    label: 'Under ₹2.5 lakh',
    helper: 'Annual family income below ₹2,50,000',
  },
  {
    value: '2.5L-5L',
    label: '₹2.5–5 lakh',
    helper: 'Annual family income between ₹2.5L and ₹5L',
  },
  {
    value: '5L-8L',
    label: '₹5–8 lakh',
    helper: 'Annual family income between ₹5L and ₹8L',
  },
  {
    value: 'above-8L',
    label: 'Above ₹8 lakh',
    helper: 'Annual family income above ₹8,00,000',
  },
  {
    value: 'unknown',
    label: "I don't have an income certificate yet",
    helper: "No problem, we'll calculate matches and show what getting one unlocks",
  },
];

