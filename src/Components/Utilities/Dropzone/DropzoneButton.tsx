import { useRef, useState } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Group, Image, SimpleGrid, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import classes from './DropzoneButton.module.css';
import { uploadFile } from '../../../Service/MediaService';

interface DropzoneButtonProps {
    close: () => void;
    form: any;
    fieldName?: string; // optional, defaults to 'profilePictureId'
}

export function DropzoneButton({ close, form, fieldName = 'profilePictureId' }: DropzoneButtonProps) {
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);
    const [file, setFile] = useState<FileWithPath | null>(null);
    const [uploadedId, setUploadedId] = useState<string | null>(null);

    const handleDrop = (files: FileWithPath[]) => {
        const selectedFile = files[0];
        setFile(selectedFile);

        uploadFile(selectedFile)
            .then((res) => {
                console.log("File uploaded successfully", res);
                setUploadedId(res.id); // keep uploaded file id
            })
            .catch((err) => {
                console.error("Error uploading file", err);
            });
    };

    const handleSave = () => {
        if (!uploadedId) return;
        form.setFieldValue(fieldName, uploadedId); // ✅ dynamically set field
        close(); // ✅ close modal
    };

    const previews = file ? (
        <Image
            src={URL.createObjectURL(file)}
            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
            alt="Preview"
            w={250}
            h={250}
            fit="cover"
            radius="md"
            style={{
                border: `2px solid ${theme.colors.gray[3]}`,
                boxShadow: theme.shadows.md,
                margin: 'auto',
            }}
        />
    ) : null;

    return (
        <div className={classes.wrapper}>
            {!file ? (
                <Dropzone
                    openRef={openRef}
                    onDrop={handleDrop}
                    className={classes.dropzone}
                    multiple={false}
                    radius="md"
                    accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                    maxSize={5 * 1024 ** 2}
                >
                    <div style={{ pointerEvents: 'none' }}>
                        <Group justify="center">
                            <Dropzone.Accept>
                                <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconCloudUpload size={50} stroke={1.5} />
                            </Dropzone.Idle>
                        </Group>
                        <Text ta="center" fw={700} fz="lg" mt="xl">
                            <Dropzone.Accept>Drop files here</Dropzone.Accept>
                            <Dropzone.Reject>Image file less than 5 MB</Dropzone.Reject>
                            <Dropzone.Idle>Upload Profile Picture</Dropzone.Idle>
                        </Text>
                        <Text className={classes.description}>
                            Drag & drop files here to upload. Only <i>.png, .jpg, .jpeg</i> under 5 MB.
                        </Text>
                    </div>
                </Dropzone>
            ) : (
                <SimpleGrid cols={1} mt="xl" style={{ textAlign: 'center' }}>
                    {previews}
                </SimpleGrid>
            )}

            {!file ? (
                <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                    Select photo
                </Button>
            ) : (
                <div className="flex gap-3 mt-3 justify-center">
                    <Button color="red" size="md" radius="xl" onClick={() => openRef.current?.()}>
                        Change photo
                    </Button>
                    <Button size="md" radius="xl" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
}
