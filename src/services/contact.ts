import Axios from 'axios';
import * as yup from 'yup';

export const contactSchema = yup.object().shape({
  name: yup.string().required('Please enter a name.'),
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Please enter a valid email address.'),
  desc: yup.string().required('Please enter a description.'),
  quiz: yup.string().oneOf(['14'])
});

export interface Contact {
  name: string;
  desc: string;
  email: string;
  quiz: string;
}

export const sendEmail = (payload: Contact) => {
  return Axios.post('https://atmarty.com/email.php', payload);
};
