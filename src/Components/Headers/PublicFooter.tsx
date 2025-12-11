import { Container, Group, ActionIcon, Text, Grid, Stack, TextInput, Button } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconHeartbeat, IconBrandLinkedin, IconArrowRight } from '@tabler/icons-react';

const PublicFooter = () => {
  const links = [
    { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'FAQ', 'Releases'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Partners', 'Legal'] },
    { title: 'Resources', links: ['Blog', 'Documentation', 'Community', 'Security', 'Status'] },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <Container size="lg">
        
        {/* Top Section */}
        <Grid gutter={50}>
          {/* Brand Column */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Group gap={8} className="mb-4">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                   <IconHeartbeat size={28} className="text-teal-600 dark:text-teal-400" stroke={2.5} />
                </div>
                <span className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">Pulse</span>
              </Group>
              <Text c="dimmed" size="sm" className="leading-relaxed max-w-xs">
                The operating system for modern healthcare. Streamlining operations and improving patient outcomes.
              </Text>
              
              <div className="mt-6">
                <Text fw={700} size="xs" c="dimmed" tt="uppercase" mb="sm">Subscribe to our newsletter</Text>
                <div className="flex gap-2">
                    <TextInput 
                        placeholder="Enter your email" 
                        radius="md" 
                        size="sm"
                        className="flex-1"
                        styles={{ input: { borderColor: '#e2e8f0', backgroundColor: 'transparent' } }}
                    />
                    <Button color="teal" radius="md" size="sm">
                        <IconArrowRight size={16} />
                    </Button>
                </div>
              </div>
            </Stack>
          </Grid.Col>

          {/* Links Columns */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Grid>
                {links.map((group) => (
                    <Grid.Col span={{ base: 6, sm: 4 }} key={group.title}>
                        <Text className="!font-bold !text-slate-900 dark:!text-white !mb-4">{group.title}</Text>
                        <Stack gap={12}>
                            {group.links.map((link) => (
                                <Text 
                                    key={link} 
                                    component="a" 
                                    href="#" 
                                    className="!text-slate-500 dark:!text-slate-400 !text-sm hover:!text-teal-600 dark:hover:!text-teal-400 !transition-colors !cursor-pointer !block"
                                >
                                    {link}
                                </Text>
                            ))}
                        </Stack>
                    </Grid.Col>
                ))}
            </Grid>
          </Grid.Col>
        </Grid>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Text c="dimmed" size="xs">
            © {new Date().getFullYear()} Pulse HMS Inc. All rights reserved.
          </Text>

          <Group gap="xs">
            <SocialIcon icon={IconBrandTwitter} />
            <SocialIcon icon={IconBrandLinkedin} />
            <SocialIcon icon={IconBrandInstagram} />
            <SocialIcon icon={IconBrandYoutube} />
          </Group>
        </div>
      </Container>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }: any) => (
    <ActionIcon 
        size="lg" 
        color="gray" 
        variant="subtle" 
        radius="xl"
        className="hover:!bg-teal-50 dark:hover:!bg-teal-900/30 hover:!text-teal-600 dark:hover:!text-teal-400 !transition-colors"
    >
        <Icon size={20} stroke={1.5} />
    </ActionIcon>
);

export default PublicFooter;