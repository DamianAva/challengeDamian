module.exports = [
    {
        path: '/auth/login',
        entity: 'user',
        method: 'login',
        type: 'post',
        auth: false,
        input: {
            params: {},
            body: {
                email: {
                    type: 'string',
                    required: true
                },
                password: {
                    type: 'string',
                    required: true
                }
            }
        }
    },
    {
        path: '/auth/logout',
        entity: 'user',
        method: 'logout',
        type: 'post',
        auth: true,
        input: {
            params: {},
            body: {}
        }
    },
    {
        path: '/events',
        entity: 'event',
        method: 'all',
        type: 'get',
        auth: true,
        input: {
            params: {}
        }
    },
    {
        path: '/notifications',
        entity: 'notification',
        method: 'all',
        type: 'get',
        auth: true,
        input: {
            params: {}
        }
    },
    {
        path: '/payment/:id',
        entity: 'payment',
        method: 'get',
        type: 'get',
        auth: true,
        input: {
            params: {
                id: {
                    type: 'int',
                    required: true
                }
            }
        }
    },
    {
        path: '/payments',
        entity: 'payment',
        method: 'all',
        type: 'get',
        auth: true,
        input: {
            params: {}
        }
    },
    {
        path: '/theatre/all',
        entity: 'theatre',
        method: 'all',
        type: 'get',
        auth: true,
        input: {
            params: {}
        }
    },
    {
        path: '/theatre/:id',
        entity: 'theatre',
        method: 'get',
        type: 'get',
        auth: true,
        input: {
            params: {
                id: {
                    type: 'int',
                    required: true
                }
            }
        }
    },
    {
        path: '/theatre/:id',
        entity: 'theatre',
        method: 'update',
        type: 'put',
        auth: true,
        input: {
            params: {},
            body: {
                name: {
                    type: 'string',
                    required: false
                },
                address: {
                    type: 'string',
                    required: false
                },
                phone: {
                    type: 'string',
                    required: false
                },
                site_url: {
                    type: 'string',
                    required: false
                },
                history: {
                    type: 'string',
                    required: false
                }
            }
        }
    },
    {
        path: '/theatre/profile',
        entity: 'theatre',
        method: 'profile',
        type: 'get',
        auth: true,
        input: {
            params: {}
        }
    },
    {
        path: '/theatre-room/:id',
        entity: 'theatre',
        method: 'getRoom',
        type: 'get',
        auth: true,
        input: {
            params: {
                id: {
                    type: 'int',
                    required: true
                }
            }
        }
    },
    {
        path: '/user/change-pass',
        entity: 'user',
        method: 'changePassword',
        type: 'post',
        auth: true,
        input: {
            params: {},
            body: {
                password: {
                    type: 'string',
                    required: true
                }
            }
        }
    },
    {
        path: '/user/forgot-password',
        entity: 'user',
        method: 'forgotPassword',
        type: 'post',
        auth: false,
        input: {
            params: {},
            body: {
                email: {
                    type: 'string',
                    required: true
                }
            }
        }
    },
    {
        path: '/user/reset-password',
        entity: 'user',
        method: 'resetPassword',
        type: 'post',
        auth: false,
        input: {
            params: {},
            body: {
                password: {
                    type: 'string',
                    required: true
                },
                reset_token: {
                    type: 'string',
                    required: true
                }
            }
        }
    },
    {
        path: '/user/update-account',
        entity: 'user',
        method: 'updateAccount',
        type: 'put',
        auth: true,
        input: {
            params: {},
            body: {
                fullname: {
                    type: 'string',
                    required: false
                },
                phone: {
                    type: 'string',
                    required: false
                }
            }
        }
    }
];