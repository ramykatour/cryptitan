export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    position: "relative",
                    boxShadow: theme.customShadows.card,
                    borderRadius: Number(theme.shape.borderRadius) * 2,
                    zIndex: 0 // Fix Safari overflow: hidden with border radius
                }
            }
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: {variant: "subtitle1"},
                subheaderTypographyProps: {
                    variant: "body2",
                    marginTop: theme.spacing(0.5)
                }
            },
            styleOverrides: {
                root: {
                    padding: theme.spacing(3, 3, 1)
                },
                action: {
                    alignSelf: "center"
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(2, 3, 2)
                }
            }
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    paddingTop: theme.spacing(1),
                    paddingRight: theme.spacing(3),
                    paddingBottom: theme.spacing(2),
                    paddingLeft: theme.spacing(3)
                }
            }
        }
    };
}
