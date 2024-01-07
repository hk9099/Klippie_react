import { AppShell, Burger, Group, ScrollArea, Skeleton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { MantineLogo } from '@mantinex/mantine-logo';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

export default function NavbarSection() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <MantineProvider>
            <AppShell
                layout="alt"
                header={{ height: 60 }}
                navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: opened } }}
                padding="md"
                styles={{
                    body: {
                        backgroundColor: '#0D0E20',
                    },
                }}
            >
                <AppShell.Header hiddenFrom="sm" 
                    styles={{
                        header: {
                            backgroundColor: '#0D0E20',
                        },
                    }}
                >
                    <Group h="100%" px="md">
                        <Text>Header</Text>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        {/* <MantineLogo size={30} /> */}
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar p="md" size="lg" 
                    styles={{
                        navbar: {
                           backgroundColor: '#0D0E20',
                           borderRight: '1px solid transparent',
                        },
                    }}
                >
                    <AppShell.Section 
                        styles={{
                            section: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            },
                        }}
                    >
                        <Text>Navbar header</Text>
                        <Burger opened={opened} onClick={toggle} size="sm" />
                    </AppShell.Section>
                    <AppShell.Section grow my="md" component={ScrollArea} offsetScrollbars>
                        60 links in a scrollable section
                        {Array(60)
                            .fill(0)
                            .map((_, index) => (
                                <Skeleton key={index} h={28} mt="sm" animate={false} />
                            ))}
                    </AppShell.Section>
                    <AppShell.Section>Navbar footer – always at the bottom</AppShell.Section>
                </AppShell.Navbar>
                <AppShell.Main>
                    <AppShell.Header  
                    styles={{
                        header: {
                            backgroundColor: '#0D0E20',
                            borderBottom: '1px solid transparent',
                        },
                    }}
                    >
                        <Group h="100%" px="md">
                            <Text>Header</Text>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                            {/* <MantineLogo size={30} /> */}
                            {opened && (
                                <Burger opened={opened} onClick={toggle} size="sm" visibleFrom="sm" />
                            )}
                        </Group>
                    </AppShell.Header>
                    Main
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    );
}
