import { Body, Controller, Post } from "@nestjs/common";
import { LoginRequestDTO } from "../dtos/login-request.dto";
import { LoginResponseDTO } from "../dtos/login-response.dto";
import { LoginService } from "@user-management/application/login/login.service";


@Controller('/login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService
  ) {}

  @Post()
  async handle(@Body() dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    return await this.loginService.execute(dto);
  }
}
