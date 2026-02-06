import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../auth/auth.types';

/**
 * Assumes JwtAuthGuard and RolesGuard (TEACHER) already ran.
 * Ensures the course :id belongs to the current user's teacherId.
 */
@Injectable()
export class CourseOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: JwtPayload;
      params: { id?: string };
    }>();
    const user = request.user;
    const courseId = request.params?.id;
    if (!courseId || !user?.teacherId) return false;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    });
    if (!course) return true; // let NotFoundException be thrown by the controller/service
    if (course.teacherId !== user.teacherId) {
      throw new ForbiddenException('You can only modify your own courses');
    }
    return true;
  }
}
