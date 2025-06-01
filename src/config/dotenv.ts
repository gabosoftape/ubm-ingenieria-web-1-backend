import {config} from 'dotenv';

config();

export const dotenv = {
    app: {
        port: process.env.PORT || 4000
    },
    postgres: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER || 'gabosoft',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || 'dc_local',
        port: process.env.DB_PORT
    },
    jwt: {
        secretKey: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN
    },
    dynamoDb: {
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion: process.env.AWS_REGION
    },
    firebaseServiceAccount: {
        type: "service_account",
        projectId: "catabum-ec0d9",
        privateKeyId: "7262562352ec3292de8399815da6d6be4c1a1001",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1om4+uOinIOq0\nlj14S3BBCueNyXYzCWFDJVF52FvyXgjqtL2JtDTGDCMkeirvEThukyLR+tiSaxkF\nmRAaYRPl2G06oVTTVjuWGULd+UH+0wS96JYvp56rUgprLjh5r+NEADoCFeiaYLH6\nI+eEKbJfm2VbDG7JPyVBnBUhsB3rjIL2YrtKJj/sQ7lj/BfbaTNpCXUrfdiQFUXR\n3DaNu/c5KihHXBqCen6nBU6pQiE3hpKvua5R4R5DVnWPVDlebZPPO4t9z8e3cK2a\nisVXbpRmAlZwa0foeICXBvdFipTRI9JSkPVU0qx9+I39LPifdLkHFzP/EFPGhQhy\nzCUNH+NfAgMBAAECggEAC0dOTDPEMpiPKm6H25/nlQpdzYacgdfLw9Ud5ZCDSR4A\ntL5LZLEdc8zOI9Y4M0cg93DIgTxv1Uu0Lo5OGy07BJM3WSQqdcMNiSkBZ3IyYGXv\nDfHS3ZutdRrvja89j4TV+mN/NqDwpCFr+8nd9u1154zpMsmnWXTD1fqgr0pV2Unx\nsqEQObyoVts4wDuuhdEjyVGt5h19APZh4/aJdhdgh+Wpk8Tt6n0ScmACnL7FB4rJ\nWFQd69AAUKaCFnSOY2Keseq8W6gVOsxjY2KQeQwF/vwR7iPwRmBdYnNBu2au81Zy\nymk1pz6P+9fuQE4turC+guHHQJKyjt+F1VnpvbbLTQKBgQD+xvHVi7oYgZ3cPsVr\n5p3e9wvz+lOLVjqPCpPFkVklQ1OusCz6UhiF6A/+c3QSA3xL+9nWm6OqQl56j3YK\n2Wi+GcyDiesOHC5yUq/hX+0/RSbe6dKuYugSzrX8EBDFG6IowBoLctE81jS1YHRY\n9WC6dJ3mjs6t4lQqwJi2tCO/0wKBgQC2gZzQzvFi3OIXLg5lJ4zLN1zzykGqBFPh\n0QnCYSRIbanYFMcI0v9+raFNRNjcs2gsBdg3FVQvnUWv5A3P6UK68IH68A9R+YR1\n/LczINXYaivV/7NHD/NlhZg2RMR9xXWztYDxd01BlPYSSHYxFQWLabktFQth6nn7\nfZBOsofixQKBgQDCJq0nxKD+B9hafGNJxKZNwQmU1RBRQFbDppXRmt/KK7JbjtnX\nsDQL5zo495ZeG9XeuX/ZsSVZm9YPo7+aqO7O3y4glztOt18Vs7lgEA/lhTcH7Dum\ntKyRmIDKIxwEePhsAWhXjRmyOLJV/bjsCaG6tR+XEQCjNbRaGAbIRCJyDQKBgE70\nQ6MR49uhMy5T/mZEdeR0TwIovb+Pn7pRdKdi3w92YcPZOUHYBjAHbYDACBFyi95/\nqMorr//pSfyN7GvFvdihs5mbwQT1rRhd++NikSDOzagGtshHXkTNRswzc831XrYg\nD2hm9EUq7El8j6UsMvndAv89227AwYTLDWL+WUsBAoGBAIJ2/lym04z0GJN4g5tq\nhPJgl0NEKeV85VeMt3DR4Sob5VZhD435Ii8DKPJJ1/l0wRvZ4G+EvLRSxzk6ItRP\nWRjf2Jwy3Q5mtum1/et/ALwt7LQ/xmPYeGO1lO/lMnQY2bxQKSWER+JYZFzIGUD4\nFsfn9OT6ivT9HFMKqojgPKtt\n-----END PRIVATE KEY-----\n",
        clientEmail: "firebase-adminsdk-kuy5z@catabum-ec0d9.iam.gserviceaccount.com",
        clientId: "108775960570087021679",
        authUri: "https://accounts.google.com/o/oauth2/auth",
        tokenUri: "https://oauth2.googleapis.com/token",
        authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
        clientX509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kuy5z%40catabum-ec0d9.iam.gserviceaccount.com",
        universeDomain: "googleapis.com"
    }
}