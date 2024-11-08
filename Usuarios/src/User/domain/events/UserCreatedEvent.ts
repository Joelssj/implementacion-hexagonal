export class UserCreatedEvent {
    constructor(public readonly userUuid: string, public readonly correo: string, public readonly leadUuid: string,  public readonly phone: string) {}
  }
  