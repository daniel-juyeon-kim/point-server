# Simple Point API Server

이 프로젝트는 간단한 포인트 적립 및 조회 기능을 제공하는 API 서버입니다. NestJS 프레임워크를 사용하여 개발되었습니다.

### 사전 요구 사항

- MySQL 데이터베이스 설정
- 환경 변수 설정

### 설치

프로젝트 의존성을 설치합니다.

```bash
npm install
```

### 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 환경 변수를 설정합니다.

```
# 데이터베이스 설정 (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=point_db

# 세션 비밀 키 (보안을 위해 실제 서비스에서는 복잡하고 유니크한 값 사용)
SESSION_SECRET=your_secret_key_here
```

### 애플리케이션 실행

#### 개발 모드

개발 모드로 애플리케이션을 실행하는 명령어입니다.

```bash
npm run start:dev
```

### 📖 API 문서 (Swagger UI)

애플리케이션이 실행 중일 때, 다음 URL에서 Swagger UI를 통해 API 문서를 확인할 수 있습니다.

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

> 참고: [API, ERD 설계 문서](DESIGN_SUMMARY.md), [개선 또는 추가 기능 아이디어 제안](<개선 또는 추가 기능 아이디어 제안.md>)