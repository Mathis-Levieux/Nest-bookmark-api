import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { Body, INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto'
import { EditUserDto } from 'src/user/dto'
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto'

describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, }))
    await app.init()
    await app.listen(3333)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl('http://localhost:3333') // Sert à définir l'URL de base pour les tests
  })

  afterAll(() => {
    app.close
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vlad@gmail.com',
      password: 'super-secret'
    }
    describe('SignUp', () => {

      it('Should throw if email empty', () => {
        return pactum.spec().post('/auth/signup',).withBody({ password: dto.password }).expectStatus(400)
      })

      it('Should throw if password empty', () => {
        return pactum.spec().post('/auth/signup',).withBody({ email: dto.email }).expectStatus(400)
      })

      it('Should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup',).expectStatus(400)
      })

      it('Should Sign Up', () => {
        return pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(201)
      })
    })

    describe('SignIn', () => {

      it('Should throw if email empty', () => {
        return pactum.spec().post('/auth/signin',).withBody({ password: dto.password }).expectStatus(400)
      })

      it('Should throw if password empty', () => {
        return pactum.spec().post('/auth/signin',).withBody({ email: dto.email }).expectStatus(400)
      })

      it('Should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin',).expectStatus(400)
      })

      it('Should Sign In', () => {
        return pactum.spec().post('/auth/signin',).withBody(dto).expectStatus(200).stores('userAT', 'access_token')
      })
    })
  })

  describe('User', () => {

    describe('Get Current User', () => {
      it('Should get current user', () => {
        return pactum.spec().get('/users/me',).withBearerToken('$S{userAT}').expectStatus(200)
      })
    })

    describe('Edit user', () => {
      it('Should edit user', () => {
        const dto: EditUserDto = {
          firstName: "Vladimir",
          email: "vlad@codewithvlad.com"
        }
        return pactum.spec().patch('/users',).withBearerToken('$S{userAT}').withBody(dto).expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
    })
  })

  describe('Bookmarks', () => {
    const dto: CreateBookmarkDto = {
      title: "Titre de folie",
      link: "http://oeoe.com"
    }
    describe('Get empty bookmarks', () => {
      it('Should send empty request', () => {
        return pactum.spec().get('/bookmark',).withBearerToken('$S{userAT}').expectStatus(200)
          .expectJsonLength(0)
      })
    })
    describe('Create Bookmark', () => {
      it('Should create a bookmark', () => {
        return pactum.spec().post('/bookmark',).withBearerToken('$S{userAT}').withBody(dto).expectStatus(201).stores('bookmarkId', 'id')
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
      })
    })
    describe('Get Bookmarks', () => {
      it('Should get bookmarks of user', () => {
        return pactum.spec().get('/bookmark',).withBearerToken('$S{userAT}').expectStatus(200).expectJsonLength(1)
      })
    })
    describe('Get Bookmark by id', () => {
      it('Should get a bookmark by his id', () => {
        return pactum.spec().get('/bookmark/{id}').withPathParams('id', '$S{bookmarkId}').withBearerToken('$S{userAT}').expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      })
    })
    describe('Edit Bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: "Nouveau titre de folie",
        description: "Nouvelle desc de folie"
      }
      it('Should edit a bookmark by his id', () => {
        return pactum.spec().patch('/bookmark/{id}').withPathParams('id', '$S{bookmarkId}').withBearerToken('$S{userAT}').withBody(dto).expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
      })
    })
    describe('Delete Bookmark by id', () => {
      it('delete a bookmark', () => {
        return pactum.spec().delete('/bookmark/{id}').withPathParams('id', '$S{bookmarkId}').withBearerToken('$S{userAT}').expectStatus(204)
      })

      it('Should get empty bookmarks', () => {
        return pactum.spec().get('/bookmark',).withBearerToken('$S{userAT}').expectStatus(200)
          .expectJsonLength(0)
      })
    })
  })
})