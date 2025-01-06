import { PasswordComparer } from "@user-management/domain/ports/password.comparer";
import { TokenGenerator } from "@user-management/domain/ports/token.generator";
import { UserRepository } from "@user-management/domain/ports/user.repository";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}


export class LoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordComparer: PasswordComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordCorrect = await this.passwordComparer.compare({
      plainTextPassword: input.password,
      encryptedPassword: user.password
    });

    if (!isPasswordCorrect) {
      throw new Error("Invalid password");
    }

    const token = this.tokenGenerator.generate(user.id);

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
