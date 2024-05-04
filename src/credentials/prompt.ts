import { input, password } from '@inquirer/prompts';
import { Credentials } from './type';

export async function promptForAuthentication(): Promise<Credentials> {
  const accountName = await input({
    message: 'Account name',
    default: 'jazeee',
    validate: (value) => value.length > 0,
  });
  const accountPassword = await password({
    message: 'Password',
    mask: true,
    validate: (value) => value.length > 0,
  });
  return { accountName, password: accountPassword };
}
