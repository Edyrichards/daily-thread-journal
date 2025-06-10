
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Download, Shield, Archive } from 'lucide-react';
import DataExport from '@/components/DataExport';
import DataBackup from '@/components/DataBackup';
import EntryArchive from '@/components/EntryArchive';

const DataManagementPage: React.FC = () => {
  return (
    <Layout title="Data Management">
      <motion.div
        className="p-4 md:p-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-foreground mb-4">
            Data Management
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage your spiritual journey data with powerful export, backup, and archiving tools.
          </p>
        </div>

        <Tabs defaultValue="export" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl">
            <TabsTrigger value="export" className="rounded-xl">
              <Download size={16} className="mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="backup" className="rounded-xl">
              <Shield size={16} className="mr-2" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="archive" className="rounded-xl">
              <Archive size={16} className="mr-2" />
              Archive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <DataExport />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <DataBackup />
          </TabsContent>

          <TabsContent value="archive" className="space-y-6">
            <EntryArchive />
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default DataManagementPage;
